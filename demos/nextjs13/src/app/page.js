import Image from "next/image";

{/*R_IMPORT_START*/}
          import BlogSection5 from '@/components/BlogSection5'
          import BlogSection4 from '@/components/BlogSection4'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <BlogSection5 />
          <BlogSection5 />
          <BlogSection4 />
          {/*R_CONTENT_END*/}
    
    </>;
}
