import { useEffect } from "react";
import { useParams } from "react-router-dom";

function EditPost({
  editBody,
  editTitle,
  setEditBody,
  setEditTitle,
  postEdit,
  posts,
}) {
  const { id } = useParams();

  const targetPost = posts.find((post) => post.id.toString() === id);

  useEffect(() => {
    if (targetPost) {
      setEditTitle(targetPost.title);
      setEditBody(targetPost.body);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  return (
    <div className="mx-auto border-4 border-gray-600 p-2 my-10 rounded-lg md:w-1/2">
      <p className="text-2xl font-bold text-center my-4">Post in edit mode</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="title" className="text-lg font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="block border border-gray-400 text-lg pl-2 w-full py-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
        <hr />
        <div className="mb-4">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <textarea
            rows={5}
            id="description"
            className="block border border-gray-400 text-lg pl-2 w-full py-2"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
        </div>
        <button
          className="bg-gray-600 mb-2 w-full py-2 text-xl font-bold
        text-white"
          onClick={() => postEdit(id)}
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default EditPost;
