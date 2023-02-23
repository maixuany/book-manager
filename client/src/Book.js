export default function Book() {
  return (
    <div className="book">
      <div className="image">
        <img src="http://localhost:3000/book.jpg" alt="" />
      </div>
      <div className="texts">
        <h2>Content</h2>
        <p className="info">
          <a className="author">Author</a>
          <time>Time Added</time>
        </p>
        <p className="summary">Intro</p>
      </div>
    </div>
  );
}
