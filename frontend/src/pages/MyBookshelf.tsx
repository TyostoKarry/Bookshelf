import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyBookshelf } from "../hooks/useMyBookshelf";

export const MyBookshelf: FC = () => {
  const { editToken, bookshelf } = useMyBookshelf();
  const navigate = useNavigate();

  useEffect(() => {
    if (!editToken) {
      navigate("/");
    }
  }, [editToken, navigate]);

  if (!bookshelf) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{bookshelf.name}</h1>
      <p className="mb-6">{bookshelf.description}</p>
      {/* TODO: Render books and other bookshelf details here */}
    </div>
  );
};
