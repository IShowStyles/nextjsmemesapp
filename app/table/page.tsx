import React from "react";
import TablePage from "@/components/table";
import { cookies } from "next/headers";

const fetchData = async () => {
  try {
    const API_URL = process.env.DOMAIN;
    const response = await fetch(API_URL + "/api/memes");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load memes:", error);
    return null;
  }
};

async function getDataOrFetch() {
  const cachedMemes = (await cookies()).get("memes")?.value;
  if (cachedMemes) {
    const parsedMemes = JSON.parse(JSON.stringify(cachedMemes));
    return parsedMemes;
  } else {
    return await fetchData();
  }
}

export default async function Table() {
  const data = await getDataOrFetch();
  const memes = data || [];
  return <TablePage memes={memes} />;
}
