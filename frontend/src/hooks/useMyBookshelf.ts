import { useContext } from "react";
import { MyBookshelfContext } from "../contexts/MyBookshelfContext";

export const useMyBookshelf = () => {
  const context = useContext(MyBookshelfContext);
  if (!context) {
    throw new Error("useMyBookshelf must be used within a MyBookshelfProvider");
  }
  return context;
};
