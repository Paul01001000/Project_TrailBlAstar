import React, { useState, useEffect } from "react";
import { View, Animated, Easing } from "react-native";
import { Border } from "../utils/styles";

const WhiteBox = ({ children, height }) => {
  const [position] = useState(new Animated.Value(100)); // 시작 위치는 아래로 설정

  useEffect(() => {
    Animated.timing(position, {
      toValue: 0, // 위로 이동할 위치
      duration: 500, // 애니메이션 지속 시간
      easing: Easing.inOut(Easing.ease), // ease-in ease-out 효과
      useNativeDriver: true, // 네이티브 드라이버 사용
    }).start();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  return (
    <Animated.View
      style={{
        transform: [{ translateY: position }], // Y축 방향으로 이동
        backgroundColor: "white",
        borderRadius: Border.br_xl,
        height: height, // 높이를 부를 때마다 다르게 조절 가능, 기본값은 50
        borderWidth: 1,
        borderColor: "transparent",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 10,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {children}
    </Animated.View>
  );
};

export default WhiteBox;
