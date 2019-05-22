import { withRouter } from 'next/router'
import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'

const Post = props => (
    <Layout>
        <h1>{props.dkey}</h1>
        <p>{props.data.text}</p>
    </Layout>
)

Post.getInitialProps = async function(context) {
    const { key } = context.query;
    const res = await fetch(`http://localhost:3000/api/${encodeURIComponent(key)}`)
    const data = await res.json();

    console.log(`Fetched data: ${JSON.stringify(data)}`)

    return { dkey : key, data }
}

export default Post