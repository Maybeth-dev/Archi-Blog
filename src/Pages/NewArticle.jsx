 import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import firebase from '../firebase'

export default function ArticleForm() {
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [author,    setAuthor]    = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await firebase
        .firestore()
        .collection('articles')
        .add({
          title,
          content,
          authorName: author || 'Anonymous',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      // Redirect back to homepage:
      navigate('/')
    } catch (err) {
      console.error('Failed to post article', err)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>New Article</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title<br/>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>
        <br/><br/>

        <label>
          Content<br/>
          <textarea
            rows={8}
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </label>
        <br/><br/>

        <label>
          Author Name<br/>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <br/><br/>

        <button type="submit">Post Article</button>
      </form>
    </div>
  )
}
