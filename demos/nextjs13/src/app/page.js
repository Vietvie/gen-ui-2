import Image from "next/image";

{/*R_IMPORT_START*/}
          import BlogSection3 from '@/components/BlogSection3'
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection4 from '@/components/BlogSection4'
          import BlogSection5 from '@/components/BlogSection5'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <BlogSection3 />
          <BlogSection2 />
          <BlogSection2 />
          <BlogSection4 />
          <BlogSection5 />
          {/*R_CONTENT_END*/}
    
    </>;
}
