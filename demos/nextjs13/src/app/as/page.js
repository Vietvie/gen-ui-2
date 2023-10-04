import Image from "next/image";

{/*R_IMPORT_START*/}
        import CTASection1 from '@/components/as/CTASection1'
        import CTASection10 from '@/components/as/CTASection10'
        import CTASection3 from '@/components/as/CTASection3'
        import CTASection5 from '@/components/as/CTASection5'
        {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
        <CTASection1 />
        <CTASection10 />
        <CTASection3 />
        <CTASection5 />
        <CTASection3 />
        {/*R_CONTENT_END*/}
    
    </>;
}
