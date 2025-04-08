import Evaluation from "@/app/components/Evaluation.js";
import Navbar from "@/app/components/StudentNavbar";


export default function Home() {
    return (
        <div>
            <Navbar />
            <div></div> 
            <br />
            <br />
            <Evaluation />
        </div>
    );
}