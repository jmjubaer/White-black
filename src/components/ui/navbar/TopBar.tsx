import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const TopBar = () => {
    const [text, setText] = useState([{ text: "Top bar text" }]);
    useEffect(() => {
        fetch("https://amlaa.vercel.app/top-moving-text")
            .then((response) => response.json())
            .then((data) => {
                setText(data);
            });
    }, []);
    const repeatedData = Array(3).fill(text);
    return (
        <div>
            <div className='text-center text-sm sm:text-base bg-[#3c3633] text-white py-3 font-light'>
                <Marquee pauseOnHover={true} speed={40}>
                    {repeatedData.map((item, index) => (
                        <p className='mx-20' key={index}>
                            {item.text}{" "}
                        </p>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default TopBar;
