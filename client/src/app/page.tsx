import { GetServerSideProps } from "next";
import React from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:8000/");
  console.log("Test:", res);
  const data = await res.text();

  return {
    props: { data },
  };
};

interface HomeProps {
  data: string;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  console.log("typeof window:", typeof window); // Add this line to check if it's running on the client or server
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>test</div>
      {/* <div dangerouslySetInnerHTML={{ __html: data }}></div> */}
    </main>
  );
};

export default Home;
