import React, { Component, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    const graphQuery = {
      query: `
        {
          user {
            status
          }
        }
      `
    }
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(graphQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Status fetch failed!");
        }
        this.setState({ status: resData.data.user.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }
    const graphQuery = {
      query: `
        query FetchPost($page: Int) {
          posts(page: $page){
            totalItems
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        }
      `,
      variables: {
        page,
      }
    };
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Post fetch failed!");
        }
        const response = resData.data.posts;
        this.setState({
          posts: response.posts.map((post) => ({
            ...post,
            imagePath: post.imageUrl,
          })),
          totalPosts: response.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    event.preventDefault();
    const graphQuery = {
      query: `
        mutation updateUserStatus($status: String!) {
          updateStatus(status: $status) {
            status
          }
        }
      `,
      variables: {
        status: this.state.status,
      }
    }
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphQuery),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Status fetch failed!");
        }
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    // Set up data (with image!)
    let formData = new FormData();
    formData.append("image", postData.image);
    if (this.state.editPost) {
      formData.append("oldPath", this.state.editPost.imagePath);
    }
    fetch("http://localhost:8080/post-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        const imageUrl = response.filePath;
        let graphQuery = {
          query: `
          mutation createNewPost($postInput: postInputData) {
            createPost(postInput: $postInput) {
              _id
              title
              content
              creator {
                name
              }
              createdAt
            }
          }
        `,
        variables: {
          postInput: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
          },
        }
        };
        if (this.state.editPost) {
          graphQuery = {
            query: `
              mutation updatePost($id: ID!, $postInput: postInputData) {
                updatePost(id: $id, postInput: $postInput) {
                  _id
                  title
                  content
                  creator {
                    name
                  }
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: {
              id: this.state.editPost._id,
              postInput: {
                title: postData.title,
                content: postData.content,
                imageUrl: imageUrl
              }
            }
          }
        }
        return fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphQuery),
        });
      })
      .then((res) => res.json())
      .then((response) => {
        console.log('response', response);
        if (response.errors && response.errors[0].status === 401) {
          throw new Error("Please put correct email or password");
        }
        if (response.errors) {
          throw new Error("Could not authenticate you!");
        }
        let resData = response.data.createPost;
        if (this.state.editPost) {
          resData = response.data.updatePost;
        }
        const post = {
          _id: resData._id,
          title: resData.title,
          content: resData.content,
          creator: resData.creator,
          createdAt: resData.createdAt,
          imagePath: resData.imageUrl,
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          let updatedTotalPost = prevState.totalPosts;
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else {
            if (prevState.posts.length >= 2) {
              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
            updatedTotalPost = updatedTotalPost + 1;
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: updatedTotalPost,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    const graphQuery = {
      query: `
        mutation deletePost($id: ID!) {
          deletePost(id: $id)
        }
      `,
      variables: {
        id: postId,
      },
    };
    fetch('http://localhost:8080/graphql', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(graphQuery)
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Post delete failed!");
        }
        this.loadPosts();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString("en-US")}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
