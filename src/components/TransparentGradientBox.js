import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Border } from "../utils/styles";

const TransparentGradientBox = ({
  children,
  height = 100,
  borderRadius = [Border.br_base, Border.br_base],
}) => {
  const [position] = useState(new Animated.Value(-100)); // 시작 위치는 위로 설정

  useEffect(() => {
    Animated.timing(position, {
      toValue: 0, // 아래로 이동할 위치
      duration: 500, // 애니메이션 지속 시간
      useNativeDriver: true, // 네이티브 드라이버 사용
    }).start();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  return (
    <Animated.View
      style={[
        styles.rect1,
        {
          transform: [{ translateY: position }], // Y축 방향으로 이동
          height,
          borderTopLeftRadius: borderRadius[0],
          borderTopRightRadius: borderRadius[0],
          borderBottomLeftRadius: borderRadius[1],
          borderBottomRightRadius: borderRadius[1],
        },
      ]}
    >
      <LinearGradient
        colors={[
          "rgba(136, 211, 206,0.7)",
          "rgba(135, 210, 206,0.7)",
          "rgba(79, 172, 254,0.7)",
          "rgba(110, 69, 226,0.7)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.0764, 0.0764, 0.3014, 0.8534]} // 각 색상의 위치를 나타내는 배열
        style={styles.gradient}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rect1: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject, // 그라데이션을 컴포넌트 영역에 꽉 채우도록 함
  },
});

export default TransparentGradientBox;
