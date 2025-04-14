"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";

export default function TablePage({
  memes: initialMemes,
}: {
  memes: { id: number; name: string; image: string; likesCount: number }[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [memes, setMemes] = useState(initialMemes);
  const [selectedMeme, setSelectedMeme] = useState<{
    id: number;
    name: string;
    image: string;
    likesCount: number;
  } | null>(null);

  // Open modal and set the meme to be edited
  const handleEdit = (meme: {
    id: number;
    name: string;
    image: string;
    likesCount: number;
  }) => {
    setSelectedMeme(meme);
    onOpen();
  };

  // Generic change handler for the form controls
  const handleChange = (field: string, value: string | number) => {
    if (!selectedMeme) return;
    setSelectedMeme({
      ...selectedMeme,
      [field]: value,
    });
  };

  // Handle file input change, converting a JPG file to a Base64 string
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg") {
      alert("Only JPG files are accepted.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (selectedMeme && reader.result) {
        handleChange("imageUrl", reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Validate meme data before updating
  const validateMeme = (meme: {
    id: number;
    name: string;
    image: string;
    likesCount: number;
  }) => {
    // Name between 3 and 100 characters
    if (meme.name.trim().length < 3 || meme.name.trim().length > 100) {
      alert("Name must be between 3 and 100 characters.");
      return false;
    }
    // Image URL either must be a valid URL ending with .jpg or a Base64 JPG string
    const trimmedImage = meme.image.trim().toLowerCase();
    if (
      !trimmedImage ||
      (!trimmedImage.endsWith(".jpg") &&
        !trimmedImage.startsWith("data:image/jpeg"))
    ) {
      alert("Image must be a valid JPG URL or a JPG file upload.");
      return false;
    }
    // Likes count between 0 and 99
    if (Number(meme.likesCount) < 0 || Number(meme.likesCount) > 99) {
      alert("Likes count must be between 0 and 99.");
      return false;
    }
    return true;
  };

  // Save changes: update via PUT call, update state, and reload the page
  const handleSave = async () => {
    if (!selectedMeme) return;
    if (!validateMeme(selectedMeme)) return;
    const API_URL = process.env.NEXT_PUBLIC_DOMAIN;
    if (!API_URL) {
      alert("NEXT_PUBLIC_DOMAIN environment variable is not defined.");
      return;
    }
    try {
      const response = await fetch(API_URL + `/api/memes/${selectedMeme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMeme),
      });
      if (response.ok) {
        const updatedMemes = memes.map((meme) =>
          meme.id === selectedMeme.id ? selectedMeme : meme
        );
        setMemes(updatedMemes);
        window.location.reload();
      } else {
        alert("Error updating meme on the server.");
      }
    } catch (error) {
      alert("Error updating meme: " + error);
    }
    onOpenChange();
    setSelectedMeme(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
        Meme Directory
      </h1>
      <div className="overflow-x-scroll no-scrollbar">
        <Table
          classNames={{
            table:
              "min-w-full border-separate border-spacing-y-4 sm:w-[135%] lg:w-[100%]",
          }}
        >
          <TableHeader className="bg-gray-100">
            <TableColumn className="px-4 py-2">Id</TableColumn>
            <TableColumn className="px-4 py-2">Name</TableColumn>
            <TableColumn className="px-4 py-2">Image (Preview)</TableColumn>
            <TableColumn className="px-4 py-2">Likes Count</TableColumn>
            <TableColumn className="px-4 py-2">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {memes.map((meme, idx) => (
              <TableRow
                key={idx}
                className="bg-slate-500/80 hover:bg-slate-400/70 transition-colors sm:w-[135%]"
              >
                <TableCell className="px-4 py-2">{meme.id}</TableCell>
                <TableCell className="px-4 py-2">{meme.name}</TableCell>
                <TableCell className="px-4 py-2">
                  <img
                    src={meme.image}
                    alt={meme.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="px-4 py-2">{meme.likesCount}</TableCell>
                <TableCell className="px-4 py-2">
                  <Button onPress={() => handleEdit(meme)} size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Edit Meme (Id: {selectedMeme?.id})
                </h2>
              </ModalHeader>
              <ModalBody className="px-4 py-4">
                {selectedMeme && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                  >
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium">
                        Name
                      </label>
                      <Input
                        value={selectedMeme.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter meme name"
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium">
                        Image URL (JPG) or Uploaded Image
                      </label>
                      <Input
                        value={selectedMeme.image}
                        onChange={(e) =>
                          handleChange("imageUrl", e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium">
                        Upload Image (JPG)
                      </label>
                      <Input
                        type="file"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium">
                        Likes Count
                      </label>
                      <Input
                        type="number"
                        value={String(selectedMeme.likesCount)}
                        onChange={(e) =>
                          handleChange("likesCount", Number(e.target.value))
                        }
                        min={0}
                        max={99}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </form>
                )}
              </ModalBody>
              <ModalFooter className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
