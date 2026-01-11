import React ,{useState,useEffect} from 'react'
import { Container,Cards } from '../components'
import service from "../appwite/configu"

export default function Signup(){
    const [post,setposts] =useState([]);
    useEffect(()=>{},[])
    service.getPost([]).then((post)=>{
        if(post){
            setposts(post.documents);
        }
    })
    return (
        <div className='py-9'>
           <Container >
            <div className='flex flex-wrap py-8 m-2'>
                {post.map((post)=>(
                    <div key={post.$id} className='m-2 p-2 w-1/3'>
                        <Cards post={post} />
                    </div>
                ))}               </div></Container> 
        </div>
    )
}