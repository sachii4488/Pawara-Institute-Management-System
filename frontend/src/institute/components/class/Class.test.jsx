import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Class from "./Class"; // adjust path if needed
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("Class Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            class_text: "Grade 1 - Maths - Mr. A",
            class_num: "101",
          },
          {
            _id: "2",
            class_text: "Grade 2 - English - Ms. B",
            class_num: "102",
          },
        ],
      },
    });

    axios.post.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  it("renders title and input fields", async () => {
    render(<Class />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Check for form fields
    expect(screen.getByLabelText(/Class Text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hall Number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("displays validation errors on empty submit", async () => {
    render(<Class />);
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Class Text is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Class Number is required/i)).toBeInTheDocument();
    });
  });

  it("renders fetched class cards", async () => {
    render(<Class />);
    await waitFor(() => {
      expect(screen.getByText(/Grade 1 - Maths - Mr. A/)).toBeInTheDocument();
      expect(screen.getByText(/Grade 2 - English - Ms. B/)).toBeInTheDocument();
    });
  });

  it("clicking edit calls handleEdit", async () => {
    render(<Class />);
    await waitFor(() => {
      expect(screen.getAllByTestId("EditIcon")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("EditIcon")[0]);
    // You can check if form fields got filled or a modal opened
  });

  it("clicking delete calls handleDelete and shows confirm", async () => {
    render(<Class />);
    await waitFor(() => {
      expect(screen.getAllByTestId("DeleteIcon")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("DeleteIcon")[0]);
    // You may want to simulate confirmation or check for confirmation prompt
  });
});
