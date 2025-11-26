import React from "react";
import axios from "axios";
import mac from "/public/MPz.jpg";
import mat from "/public/Mkz.jpg";

export function Autors() {
    return (
        <div className="bg-gray-500 h-full">
            <h1 className="text-[100px] text-center">Informacje o Autorach</h1>

            <div className="flex justify-center gap-100 mt-10">

                <div className="w-[300px] text-center">
                    <h2 className="text-[50px] pb-[30px]">Maciej Puchalski</h2>
                    <img
                        src={mac}
                        className="rounded-xl mx-auto transition-transform duration-5000000 hover:rotate-72011111222222"
                    />
                </div>

                <div className="w-[300px] text-center">
                    <h2 className="text-[50px] pb-[30px]">Mateusz Kraszewski</h2>
                    <img
                        src={mat}
                        className="rounded-xl mx-auto transition-transform duration-5000000 hover:rotate-72011111222222"
                    />
                </div>

            </div>
        </div>
    );
}


