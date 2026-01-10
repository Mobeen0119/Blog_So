import React, { useState, useEffect } from "react";
import { Container, PostForm } from "../components";
import service from "../appwite/configu";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
  const [post, setposts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      service.getPost(slug).then((post) => {
        if (post) {
          setposts(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  return post ? (
    <div className="py-9">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}
