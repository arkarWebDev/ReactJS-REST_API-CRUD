import Feed from "../components/Feed";

function HomePage({ posts, loading, errorMsg }) {
  return (
    <div>
      {loading && <p>loading ...</p>}
      {!loading && errorMsg && <p>{errorMsg}</p>}
      {posts.length &&
        !loading &&
        !errorMsg &&
        posts.map((post) => {
          return <Feed key={post.id} post={post} />;
        })}
    </div>
  );
}

export default HomePage;
