// pages
import HomePage from "./pages/Home";
import PostDeatailsPage from "./pages/PostDeatails";
import CreatePost from "./pages/CreatePost";
import About from "./pages/About";
import Missing from "./pages/Missing";
import EditPost from "./pages/EditPost";

// axios
import apiCall from "./api/apiCall";

// components
import SearchBox from "./components/SearchBox";
import Nav from "./components/Nav";
import Header from "./components/Header";

// react
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// date-fns
import { format } from "date-fns";

// custom hooks
import useResize from "./hooks/useResize";
import useAxiosCall from "./hooks/useAxiosCall";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const navigate = useNavigate();

  const { width } = useResize();
  const { postData, errorMsg, loading } = useAxiosCall(
    "http://localhost:3500/posts"
  );

  useEffect(() => {
    setPosts(postData);
  }, [postData]);

  useEffect(() => {
    getSearchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const postCreate = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;

    try {
      const publish_at = format(new Date(), "MMMM dd, yyyy pp");
      const newPost = { id, title, body, publish_at };
      const response = await apiCall.post("posts", newPost);
      const newPostsData = [...posts, response.data];
      setPosts(newPostsData.reverse());
      setTitle("");
      setBody("");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const postEdit = async (id) => {
    const publish_at = format(new Date(), "MMMM dd, yyyy pp");
    const editPost = { id, title: editTitle, body: editBody, publish_at };

    try {
      const response = await apiCall.patch(`posts/${id}`, editPost);
      setPosts(
        posts.map((post) =>
          post.id.toString() === id ? { ...response.data } : post
        )
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePost = async (id) => {
    try {
      await apiCall.delete(`posts/${id}`);
      const feedbackPosts = posts.filter((post) => post.id.toString() !== id);
      setPosts(feedbackPosts);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSearchPost = (e = null) => {
    e !== null && e.preventDefault();
    const searchedPostsData = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(searchKey.toLowerCase()) ||
        post.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    if (!searchedPostsData.length || searchKey === "")
      setPosts(posts.reverse());
    else setPosts(searchedPostsData.reverse());
  };

  return (
    <section>
      <div className="flex bg-gray-400 items-center justify-between px-10 py-4 flex-col md:flex-row space-y-6 md:space-y-0">
        <Header title={"React Blog"} />
        <SearchBox
          setSearchKey={setSearchKey}
          searhKey={searchKey}
          getSearchPost={getSearchPost}
        />
        <Nav />
      </div>
      <section className="px-2">
        <div className="bg-gray-600 text-white text-sm md:text-lg text-center font-semibold py-2 px-10 rounded-md my-4">
          <p>
            You are viewing form
            {width < 768
              ? " mobile device"
              : width < 992
              ? " tablet device"
              : " desktop device"}
          </p>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage posts={posts} errorMsg={errorMsg} laoding={loading} />
            }
          />
          <Route
            path="/post/:id"
            element={<PostDeatailsPage posts={posts} deletePost={deletePost} />}
          />
          <Route
            path="/createPost"
            element={
              <CreatePost
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                postCreate={postCreate}
              />
            }
          />
          <Route
            path="/editPost/:id"
            element={
              <EditPost
                postEdit={postEdit}
                editTitle={editTitle}
                editBody={editBody}
                setEditTitle={setEditTitle}
                setEditBody={setEditBody}
                posts={posts}
              />
            }
          />
          <Route path="/about" element={<About width={width} />} />
          <Route path="/*" element={<Missing />} />
        </Routes>
      </section>
    </section>
  );
}

export default App;
