import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyBookshelf } from "../hooks/useMyBookshelf";

export const MyBookshelf: FC = () => {
  const { editToken, bookshelf, books } = useMyBookshelf();
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
      {/* TODO: Update placeholder book rendering */}
      <h2 className="text-xl font-semibold mb-2">Books:</h2>
      {books.length === 0 ? (
        <p>No books in your bookshelf. Start adding some!</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book) => (
            <li key={book.id} className="border-b py-2">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
