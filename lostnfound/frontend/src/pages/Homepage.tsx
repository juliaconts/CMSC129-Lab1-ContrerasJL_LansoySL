import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Add Post Button */}
            <label htmlFor="add-post-modal" className="btn bg-black text-white border-none rounded-lg text-[15px] mb-4">
                + Add Post
            </label>

            {/* Modal */}
            <input type="checkbox" id="add-post-modal" className="modal-toggle" />
            <div className="modal fixed z-[100]">
                <div className="modal-box bg-[#f34700] text-white relative border-0 rounded-lg"> 
                    <label 
                        htmlFor="add-post-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2 text-black text-lg border-none"
                    >
                        ✕
                    </label>

                    <h3 className="text-lg font-bold mb-4">Create New Post</h3>

                    <form className="flex flex-col gap-2">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Title</legend>
                            <input type="text" className="input input-bordered w-full text-[#3d4451]" placeholder="Enter Title"/>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend ">Description</legend>
                            <textarea className="textarea h-20 w-full bg-white text-[#3d4451] rounded-lg" placeholder="Describe the item..."></textarea>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Location</legend>
                            <input type="text" className="input input-bordered w-full text-[#3d4451]" placeholder="Enter Location"/>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Where to Claim/Return?</legend>
                            <textarea className="textarea h-15 w-full bg-white text-[#3d4451] rounded-lg" placeholder="Add retrieval details..."></textarea>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Status</legend>
                            <div className="flex justify-center gap-30">
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input type="radio" name="radio-1" className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" />
                                    lost item
                                </label>
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input type="radio" name="radio-1" className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" />
                                    found item
                                </label>
                            </div>    
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Pick a file</legend>
                            <input type="file" className="file-input w-full text-black rounded-lg hover:border-[#f34700]" />
                        </fieldset>
                        <button
                            type="submit"
                            className="btn bg-black text-white border-none rounded-lg w-full text-[15px] hover:bg-gray-800"
                            onClick={ (e) => {
                                e.preventDefault();
                                alert("Successfully posted!");
                                const modal = document.getElementById("add-post-modal") as HTMLInputElement;
                                if (modal) modal.checked = false;
                            }}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}