"use client";
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";

export function ListPage({
  memes: initialMemes,
}: {
  memes: { id: number; name: string; image: string; likesCount: number }[];
}) {
  return (
    <div className="mx-auto p-4 w-full container">
      <h1 className="text-2xl font-bold mb-6">Список Мемів</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialMemes &&
          initialMemes.map((meme) => (
            <Card key={meme.id} className="overflow-hidden w-124">
              <div className="relative w-full h-48">
                <Image
                  srcSet={meme.image}
                  src={meme.image}
                  alt={meme.name}
                  height={192}
                  width={556}
                  className="top-0 object-cover  max-w-[556px] left-0 right-0 w-124 h-48"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{meme.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {meme.likesCount}
                  </span>
                  <a
                    href={meme.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Посилання
                  </a>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
