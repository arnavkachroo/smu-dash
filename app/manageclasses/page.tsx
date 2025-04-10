import ManageClasses from "@/app/components/manageClasses";
import Navbar from "@/app/components/ProfessorNavbar";


export default function Home() {
    return (
        <div>
            <Navbar />
            <div></div>
            <br />
            <br />
            <ManageClasses />
        </div>
    );
}