import Image from "next/image";

{/*R_IMPORT_START*/}
        import ContactSection4 from '@/components/_/ContactSection4'
        import BlogSection2 from '@/components/_/BlogSection2'
        {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
        <ContactSection4 />
        <BlogSection2 />
        {/*R_CONTENT_END*/}
    
    </>;
}
