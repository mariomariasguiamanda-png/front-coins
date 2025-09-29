import { GetServerSideProps } from "next";

const Index = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/login",
    permanent: false,
  },
});

export default Index;
