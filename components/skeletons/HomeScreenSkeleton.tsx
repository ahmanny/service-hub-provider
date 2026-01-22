import React from "react";
import { ScrollView, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton";

export default function HomeScreenSkeleton() {
  return (
    <View>
      {/* New Requests Section */}
      <View style={{ marginTop: 32 }}>
        <ShimmerSkeleton width="40%" height={20} borderRadius={6} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {[1, 2].map((i) => (
            <ShimmerSkeleton
              key={i}
              width={280}
              height={220}
              borderRadius={24}
              style={{ marginRight: 12 }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Schedule Section */}
      <View style={{ marginTop: 32 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <ShimmerSkeleton width="50%" height={20} borderRadius={6} />
        </View>
        <ShimmerSkeleton width="100%" height={150} borderRadius={24} />
      </View>

      {/* Stats Grid */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 32 }}>
        <ShimmerSkeleton
          width="48%"
          height={80}
          borderRadius={16}
          style={{ flex: 1 }}
        />
        <ShimmerSkeleton
          width="48%"
          height={80}
          borderRadius={16}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
