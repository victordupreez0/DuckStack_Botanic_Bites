import React from 'react'
import { Link } from 'react-router-dom';

function CareGuideBannerBody(){
    return(
    <div className="h-100 flex flex-col items-start">
            <h2 className="text-black text-4xl text-left ml-5 font-bold mt-20">Care guides have never looked this good!</h2>
            <p className="text-black text-2xl text-left ml-5 mt-2">Give your plant the care it deserves.</p>

            <Link className="btn ml-5 mt-10 text-white bg-black" to='/care'>Care Guides</Link>
        </div>
    )
}

export default CareGuideBannerBody;