import { GetServerSideProps } from "next";

const Index = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/homepage",
    permanent: false,
  },
});

export default Index;
