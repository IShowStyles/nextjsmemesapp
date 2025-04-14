import { cookies } from "next/headers";
import { ListPage } from "../../components/list";
import { log } from "console";

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
    log("Cached memes:", parsedMemes);
    return parsedMemes;
  } else {
    return await fetchData();
  }
}

export default async function List() {
  const data = await getDataOrFetch();
  const memes = data || [];
  if (!memes) {
    return <div>Loading...</div>;
  }
  if (memes.length === 0) {
    return <div>No memes available.</div>;
  }
  console.log(memes);
  return (
    <>
      <ListPage memes={memes} />
    </>
  );
}
