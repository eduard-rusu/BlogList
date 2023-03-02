const dummy = () => 1;

const totalLikes = (arr) => {
  let total = 0;
  arr.forEach((blog) => {
    total += blog.likes;
  });
  return total;
};

const favoriteBlog = (arr) => {
  let maxLikes = 0;
  let retObj = {};

  arr.forEach((blog) => {
    if (blog.likes >= maxLikes) {
      maxLikes = blog.likes;
      retObj = blog;
    }
  });
  delete retObj.id;
  delete retObj.url;
  return retObj;
};

const mostBlogs = (arr) => {
  const bloggers = [];

  arr.forEach((blog) => {
    let blogger = bloggers.find((p) => p.author === blog.author);
    if (blogger) {
      blogger.blogs += 1;
    } else {
      blogger = {};
      blogger.author = blog.author;
      blogger.blogs = 1;
      bloggers.push(blogger);
    }
  });

  let ans = {};

  bloggers.reduce((acc, cur) => {
    if (cur.blogs > acc) {
      ans = cur;
      return cur.blogs;
    }
    return acc;
  }, 0);

  return ans;
};

const mostLikes = (arr) => {
  const bloggers = [];

  arr.forEach((blog) => {
    let blogger = bloggers.find((p) => p.author === blog.author);
    if (blogger) {
      blogger.likes += blog.likes;
    } else {
      blogger = {};
      blogger.author = blog.author;
      blogger.likes = blog.likes;
      bloggers.push(blogger);
    }
  });

  let ans = {};

  bloggers.reduce((acc, cur) => {
    if (cur.likes > acc) {
      ans = cur;
      return cur.likes;
    }
    return acc;
  }, 0);

  return ans;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
