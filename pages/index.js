import Link from "next/link"
import Header from "../components/Header"
import Layout from "../components/MyLayout"
import fetch from "isomorphic-unfetch"
import AddTextForm from "../components/AddTextForm"
import React from "react"

// const Index = props => (
//   <Layout>
//     <h1>lincoon</h1>
//     <AddTextForm submitText={Index.submmitText}/>
//     <ul>
//       {
//         props.datas.map(data => (
//           <li key={data.key}>
//             <Link as={`/p/${data.key}`} href={`/post?id=${data.key}`}>
//               <a>{data.key}</a>
//             </Link>
//           </li>
//         ))
//       }  
//     </ul>
//   </Layout>
// )

// Index.getInitialProps = async function() {
//   const res = await fetch('http://localhost:3000/api/getAll')
//   const data = await res.json()

//   const datas = Object.keys(data).map(key => ({key, value : data[key]}));
//   console.log(`Show data fetched. Count: ${datas.length}`)

//   return { datas }

// }

// Index.submitText = (key, value) => {
//   console.log(key, value)
// }

// export default Index

export default class Index extends React.Component {
  render() {
    return <Layout>
      <h1>lincoon</h1>
      <AddTextForm />
      <ul>
        {
          this.props.datas.map(data => (
            <li key={data.key}>
              <Link as={`/p/${data.key}`} href={`/post?key=${data.key}`}>
                <a>{data.key}</a>
              </Link>
              <button onClick={async () => await this.remove(data.key)}>remove</button>
            </li>
          ))
        }  
      </ul>
    </Layout>
  }

  static async getInitialProps() {
    const datas = await Index.getAllDatas();
    return { datas };
  }

  static async getAllDatas() {
    const res = await fetch('http://localhost:3000/api/getAll')
    const data = await res.json()
  
    const datas = Object.keys(data).map(key => ({key, value : data[key]}));
    console.log(`Show data fetched. Count: ${datas.length}`)
  
    return datas
  }

  submitText(key, value) {
    console.log(key, value)
  }
  
  async remove(key) {
    await fetch(`http://localhost:3000/api/${encodeURIComponent(key)}`, { method:'DELETE' })
    console.log(`remove : ${key}`)
    // const datas = await Index.getAllDatas();
    // this.props.datas.unshift()
  }
}