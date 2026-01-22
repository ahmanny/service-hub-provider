import SelectServiceModal from "@/components/BookingRequest/ServiceSelectModal";
import { ThemedText } from "@/components/ui/Themed";
import { isTimeWithinRange } from "@/constants/dateTimePicker";
import {
  getServicesForType,
  requiresLocationChoice,
  SERVICE_META,
  ServiceType,
} from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingSetupInfo } from "@/types/provider.types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import ThemedCard from "../ui/Themed/ThemedCard";
import SelectTimeModal from "./SelectTimeModal";

interface Props {
  selectedService: ServiceType;
  setBookingSetup: React.Dispatch<
    React.SetStateAction<BookingSetupInfo | null>
  >;
  handleBookingSetup: () => void;
}

export default function BookingSetup({
  selectedService,
  setBookingSetup,
  handleBookingSetup,
}: Props) {
  const [service, setService] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<"home" | "shop">("home");
  const [locationInputType, setLocationInputType] = useState<"gps" | "manual">(
    "gps"
  );
  const [address, setAddress] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [validatedCoords, setValidatedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // THEME COLORS
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card"); // Assuming your hook has 'card'
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint"); // Use the theme's primary/brand color

  const onChange = (_: any, value?: Date) => {
    setShowPicker(false);
    if (!value) return;

    if (pickerMode === "date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value < today)
        return Alert.alert("Invalid date", "Please select a future date");
      setSelectedDate(value);
    } else {
      if (!isTimeWithinRange(value)) {
        return Alert.alert(
          "Unavailable time",
          "Service runs between 8:00 AM and 9:00 PM"
        );
      }
      setSelectedTime(value);
    }
  };

  const canSubmit =
    service &&
    selectedDate &&
    selectedTime &&
    !isGeocoding &&
    (locationInputType === "gps" ||
      (validatedCoords !== null && !addressError));

  const onConfirm = () => {
    if (!canSubmit) return;
    const finalDateTime = new Date(selectedDate!);
    finalDateTime.setHours(
      selectedTime!.getHours(),
      selectedTime!.getMinutes()
    );

    setBookingSetup({
      service,
      locationType,
      bookingDateTime: finalDateTime.toISOString(),
      locationSource: locationInputType === "manual" ? "manual" : "current",
      addressText: locationInputType === "manual" ? address : null,
    });
    handleBookingSetup();
  };

  const validateAndGetCoords = async (text: string) => {
    if (text.length < 10) return; // Don't search for very short strings

    setIsGeocoding(true);
    setAddressError(null);

    try {
      const results = await Location.geocodeAsync(text);
      if (results.length > 0) {
        setValidatedCoords({
          lat: results[0].latitude,
          lng: results[0].longitude,
        });
        setAddressError(null);
      } else {
        setValidatedCoords(null);
        setAddressError(
          "We couldn't find this exact location. Try adding a city or street number."
        );
      }
    } catch (error) {
      setAddressError(
        "Error verifying address. Check your internet connection."
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (locationInputType === "manual" && address.length > 10) {
        validateAndGetCoords(address);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  return (
    <BottomSheetScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: background },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Booking Details</ThemedText>
        <ThemedText style={{ color: muted }}>
          Please fill in the details below
        </ThemedText>
      </View>

      {/* 1. SERVICE SELECTION */}
      <Section title="Select Service" labelColor={muted}>
        <SelectCard
          onPress={() => setShowServiceModal(true)}
          borderColor={border}
          backgroundColor={cardBg}
        >
          <View style={styles.selectionContent}>
            <FontAwesome6
              name={SERVICE_META[selectedService].icon}
              size={18}
              color={tint}
              style={{ marginRight: 10 }}
            />
            <ThemedText style={{ flex: 1 }}>
              {service
                ? getServicesForType(selectedService).find(
                    (s) => s.value === service
                  )?.name
                : "Choose a service..."}
            </ThemedText>
            <Ionicons name="chevron-down" size={18} color={muted} />
          </View>
        </SelectCard>
      </Section>

      {/* 2. DATE & TIME */}
      <Section title="When would you like this?" labelColor={muted}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.flexCard,
              { borderColor: border, backgroundColor: cardBg },
            ]}
            onPress={() => {
              setPickerMode("date");
              setShowPicker(true);
            }}
          >
            <ThemedText style={[styles.inputLabel, { color: muted }]}>
              Date
            </ThemedText>
            <ThemedText style={!selectedDate && { color: muted }}>
              {selectedDate ? selectedDate.toDateString() : "Pick Date"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!selectedDate}
            style={[
              styles.flexCard,
              { borderColor: border, backgroundColor: cardBg },
              !selectedDate && { opacity: 0.5 },
            ]}
            onPress={() => {
              // setPickerMode("time");
              // setShowPicker(true);
              setShowTimeModal(true);
            }}
          >
            <ThemedText style={[styles.inputLabel, { color: muted }]}>
              Time
            </ThemedText>
            <ThemedText style={!selectedTime && { color: muted }}>
              {selectedTime
                ? selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Pick Time"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Section>

      {/* 3. LOCATION TYPE */}
      {requiresLocationChoice(selectedService) && (
        <Section title=" Where?" labelColor={muted}>
          <View style={styles.pillContainer}>
            <Pill
              label="In Shop"
              active={locationType === "shop"}
              onPress={() => setLocationType("shop")}
              icon="business"
              activeColor={tint}
              inactiveBorder={border}
              inactiveBg={cardBg}
            />
            <Pill
              label="Home Service"
              active={locationType === "home"}
              onPress={() => setLocationType("home")}
              icon="home"
              activeColor={tint}
              inactiveBorder={border}
              inactiveBg={cardBg}
            />
          </View>
        </Section>
      )}

      {/* 4. ADDRESS SOURCE (GPS vs MANUAL) */}
      {locationType === "home" && (
        <Section title=" Address Information" labelColor={muted}>
          <ThemedCard style={[styles.addressCard, { borderColor: border }]}>
            <RadioButton.Group
              value={locationInputType}
              onValueChange={(v) => setLocationInputType(v as any)}
            >
              <Pressable
                style={styles.optionRow}
                onPress={() => setLocationInputType("gps")}
              >
                <RadioButton.Android
                  value="gps"
                  color={tint}
                  uncheckedColor={muted}
                />
                <ThemedText>Use my current GPS location</ThemedText>
              </Pressable>
              <Pressable
                style={styles.optionRow}
                onPress={() => setLocationInputType("manual")}
              >
                <RadioButton.Android
                  value="manual"
                  color={tint}
                  uncheckedColor={muted}
                />
                <ThemedText>Enter address manually</ThemedText>
              </Pressable>
            </RadioButton.Group>

            {locationInputType === "manual" && (
              <View>
                <BottomSheetTextInput
                  placeholder="E.g. No 12, Ahmadu Bello Way, Lagos"
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    // Clear previous results while typing
                    if (validatedCoords) setValidatedCoords(null);
                  }}
                  // Trigger validation when they finish typing
                  onBlur={() => validateAndGetCoords(address)}
                  style={[
                    styles.input,
                    {
                      borderColor: addressError
                        ? "#FF3B30"
                        : validatedCoords
                        ? tint
                        : border,
                      color: textColor,
                      backgroundColor: background,
                    },
                  ]}
                  placeholderTextColor={muted}
                />

                {isGeocoding && (
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: tint,
                      marginTop: 4,
                      marginLeft: 4,
                    }}
                  >
                    Verifying address...
                  </ThemedText>
                )}

                {addressError && (
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: "#FF3B30",
                      marginTop: 4,
                      marginLeft: 4,
                    }}
                  >
                    {addressError}
                  </ThemedText>
                )}

                {validatedCoords && !isGeocoding && (
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: tint,
                      marginTop: 4,
                      marginLeft: 4,
                    }}
                  >
                    ✓ Location verified
                  </ThemedText>
                )}
              </View>
            )}
          </ThemedCard>
        </Section>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onConfirm}
          style={[
            styles.button,
            { backgroundColor: tint },
            !canSubmit && styles.buttonDisabled,
          ]}
        >
          <ThemedText style={styles.buttonText}>
            Find {SERVICE_META[selectedService].label}s
          </ThemedText>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate ?? new Date()}
          mode={pickerMode}
          is24Hour={false}
          minimumDate={new Date()}
          onChange={onChange}
        />
      )}

      <SelectServiceModal
        service={service}
        services={getServicesForType(selectedService)}
        setService={setService}
        showModal={showServiceModal}
        setShowModal={setShowServiceModal}
      />
      <SelectTimeModal
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        setShowModal={setShowTimeModal}
        showModal={showTimeModal}
      />
    </BottomSheetScrollView>
  );
}

/* HELPER COMPONENTS */

function Section({ title, children, labelColor }: any) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionLabel, { color: labelColor }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function SelectCard({ children, onPress, borderColor, backgroundColor }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { borderColor, backgroundColor }]}
    >
      {children}
    </TouchableOpacity>
  );
}

function Pill({
  label,
  active,
  onPress,
  icon,
  activeColor,
  inactiveBorder,
  inactiveBg,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? activeColor : inactiveBg,
          borderColor: active ? activeColor : inactiveBorder,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#fff" : "#666"}
        style={{ marginBottom: 4 }}
      />
      <ThemedText style={[styles.pillText, active && { color: "#fff" }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  selectionContent: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row", gap: 12 },
  flexCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  pillContainer: { flexDirection: "row", gap: 12 },
  pill: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  pillText: { fontSize: 14, fontWeight: "600" },
  addressCard: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  footer: { padding: 20, marginTop: 20 },
  button: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  buttonDisabled: { opacity: 0.4, elevation: 0 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
