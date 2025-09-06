import React from "react";

function MemoizedChildrenComponent({children}:{children: React.ReactNode}) {
    return <>{children}</>;
}
const MemoizedChildren = React.memo(MemoizedChildrenComponent);
export default MemoizedChildren;