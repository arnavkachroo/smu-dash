import ManageStudents from "@/app/components/manageStudents";
import Navbar from "@/app/components/ProfessorNavbar";


export default function Home() {
    return (
        <div>
            <Navbar />
            <div></div>
            <br />
            <br />
            <ManageStudents />
        </div>
    );
}