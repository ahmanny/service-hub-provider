import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, View } from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

type PhoneInputProps = {
  defaultphone: string;
  setLocalInputValue: React.Dispatch<React.SetStateAction<string>>;
  localInputValue: string;
  setSelectedCountry: React.Dispatch<
    React.SetStateAction<ICountry | undefined>
  >;
  selectedCountry: ICountry | undefined;
};

export default function ModernPhoneInput({
  defaultphone,
  localInputValue,
  selectedCountry,
  setLocalInputValue,
  setSelectedCountry,
}: PhoneInputProps) {
  function handleInputChange(phoneNumber: string) {
    setLocalInputValue(phoneNumber);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "card");

  return (
    <View style={styles.container}>
      <PhoneInput
        defaultValue={defaultphone}
        value={localInputValue}
        onChangePhoneNumber={handleInputChange}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        defaultCountry="NG"
        placeholder="Phone number"
        theme={useThemeColor({}, "background") === "dark" ? "dark" : "light"}
        phoneInputStyles={{
          container: {
            backgroundColor: background,
            borderColor: border,
            borderRadius: 16,
            height: 56,
          },
          flagContainer: {
            backgroundColor: "transparent",
            marginRight: -20,
          },
          callingCode: {
            color: textColor,
          },
          input: {
            color: textColor,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
});
