import React from 'react';
import Topbar from '@/components/Topbar/Topbar';
import SolvingSpace from '@/components/SolvingSpace/SolvingSpace';

type ProblemPageProps = {
    
};

const ProblemPage:React.FC<ProblemPageProps> = () => {
    
    return (
        <div>
            <Topbar problemPage={true}/>
            <SolvingSpace/>
        </div>
    )
}
export default ProblemPage;