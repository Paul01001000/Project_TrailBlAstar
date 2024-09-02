import { useContext } from "react";
import { Web3Context } from "../contexts/Web3Context";

export const usePlaces = () => {
  const { places, addPlace, deletePlace, updatePlace } =
    useContext(Web3Context);

  return { places, addPlace, deletePlace, updatePlace };
};
