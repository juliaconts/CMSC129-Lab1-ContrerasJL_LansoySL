import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1> this is homepage !</h1>
        </div>
    )
}