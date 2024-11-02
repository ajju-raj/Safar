import React from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import moment from 'moment';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
    }) => {

    const [title, setTitle] = React.useState(storyInfo?.title || '');
    const [storyImg, setStoryImg] = React.useState(storyInfo?.imageUrl || '');
    const [story, setStory] = React.useState(storyInfo?.story || '');
    const [visitedLocation, setVisitedLocation] = React.useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = React.useState(storyInfo?.visitedDate || '');
    const [error, setError] = React.useState('');
    const [isUpdating, setIsUpdating] = React.useState(false); // New state to track update mode

    // delete image in the add story
    const handleDeleteStoryImg = async () => {

        // deleting the image
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params:{
                imageUrl: storyInfo.imageUrl,
            },
        });
        
        if(deleteImgRes.data){
            const storyId = storyInfo._id;

            const postdata = {
                title,
                story,
                visitedLocation,
                imageUrl: "",
                visitedDate: moment().valueOf(),
            };

            // update the story with empty image
            const response = await axiosInstance.put(
                '/edit-story/' + storyId,
                postdata
            );
            setStoryImg(null);
        }
    };

    const addNewTravelStory = async () => {
        try{
            let imageUrl= "";

            // upload image if available
            if(storyImg){
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";    
            }
            const response = await axiosInstance.post('/add-travel-story', {
                title,
                story,
                visitedLocation,
                imageUrl: imageUrl || "",
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            });
            if(response.data && response.data.story){
                toast.success("Story Added Successfully");
                getAllTravelStories();
                onClose();
            }
        }
        catch(error){
            if(
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            {
                setError(error.response.data.message);
            }
            else{
                setError("An unknown error occured. Please try again");
            }
        }
    };

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        setIsUpdating(true);  // Start update mode

        try{
            let imageUrl= "";

            // can't use const as will throw error as it's variable and we are updating it
            let postdata = {
                title,
                story,
                visitedLocation,
                imageUrl: storyInfo.imageUrl || "",
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            };

            if(typeof storyImg === "object"){
                // upload new image
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";

                postdata = {
                    ...postdata,
                    imageUrl: imageUrl,
                };
            }

            const response = await axiosInstance.put(
                '/edit-story/' + storyId, 
                postdata
            );

            if(response.data && response.data.story){
                toast.success("Story Updated Successfully");
                getAllTravelStories();
                onClose();
            }
        }
        catch(error){
            if(
                error.response &&
                error.response.data &&
                error.response.data.message
            )
            {
                setError(error.response.data.message);
            }
            else{
                setError("An unknown error occured. Please try again");
            }
        }
        finally {
            setIsUpdating(false);  // End update mode
        }
    };

    const handleAddOrUpdateClick = () => {
        console.log('Input Data', title, storyImg, story, visitedLocation, visitedDate);

        if(!title){
            setError("Please enter a title");
            return;
        }
        if(!story){
            setError("Please enter a story");
            return;
        }
        setError("");

        if(type === 'edit'){
            updateTravelStory();
        }
        else{
            addNewTravelStory();
        }
    };


  return (
    <div className='relative'>
    <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
            {type === 'add' ? 'Add Story' : 'Update Story'}
        </h5>

        <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                {type === "add" ? <button className="btn-small" onClick = {handleAddOrUpdateClick}>
                    <MdAdd className="text-lg" />
                    ADD STORY
                </button>: <>
                    <button className="btn-small" onClick={handleAddOrUpdateClick}>
                        <MdUpdate className = "text-lg" /> UPDATE STORY
                    </button>

                    {!isUpdating && (<button className="btn-small btn-delete" onClick={onClose}>
                        <MdDeleteOutline className="text-lg" />
                        DELETE STORY
                    </button>)}
                </>}
                <button 
                className=""
                onClick = {onClose}
                >
                    <MdClose className="text-xl text-slate-400" />
                </button>
            </div>

            {error && (<p className="text-xs text-red-500 pt-2">{error}</p>
            )}

        </div>
    </div>
    <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
            <label className="input-label">TITLE</label>
            <input 
            type="text" 
            className="text-2xl text-slate-950 outline-none"
            placeholder="Enter Title"
            value={title}
            onChange={({target}) => setTitle(target.value)}
            />
            
            <div className="my-3">
                <DateSelector date={visitedDate} setDate={setVisitedDate} />
            </div>

            <ImageSelector 
                image={storyImg} 
                setImage={setStoryImg} 
                handleDeleteImg={handleDeleteStoryImg}
            />

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">STORY</label>
                <textarea 
                type="text" 
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                placeholder='Your Story'
                rows={10}
                value={story}
                onChange={({target}) => setStory(target.value)}
                />
            </div>

            <div className="pt-3">
                <label className="input-label">VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
            </div>
        </div>
     </div>
    </div>
  )
};

export default AddEditTravelStory;
