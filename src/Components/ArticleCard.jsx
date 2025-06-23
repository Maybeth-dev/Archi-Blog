// import React from "react";

// export default function ArticleCard({ article }) {
//   const timestamp = article.publishedAt ?? article.createdAt;

//   let displayDate = "No date";
//   if (timestamp?.seconds) {
//     displayDate = new Date(timestamp.seconds * 1000).toLocaleString();
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
//       {article.imageUrl ? (
//         <img
//           src={article.imageUrl}
//           alt={article.title}
//           className="h-48 w-full object-cover"
//         />
//       ) : (
//         <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
//           <span className="text-gray-400">Image</span>
//         </div>
//       )}

//       <div className="p-4 flex-1 flex flex-col justify-between">
//         <p className="text-xs text-gray-500 mb-1">
//           {article.category}  | {article.authorName}
//         </p>

//         <h2 className="text-lg font-semibold text-gray-800 mb-2">
//           {article.title}
//         </h2>
        
//         <div className="mt-auto flex justify-between items-center">
//           <span className="text-xs text-indigo-600 font-medium">
//             {displayDate}
//           </span>
//           <span className="text-sm font-semibold text-indigo-600">
//             Read more →
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function ArticleCard({ article }) {
  const timestamp = article.publishedAt || article.createdAt;
  let date = "No date";
  if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000).toLocaleString();
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {article.imageUrl ? (
        <img src={article.imageUrl} alt={article.title}
             className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between min-h-[10rem]">
        <div>
          <p className="text-xs text-gray-500 mb-1">
  {article.category} | {article.author || article.authorName || 'Unknown Author'}
</p>
      
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {article.title}
          </h2>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-indigo-600 font-medium">{date}</span>
          <span className="text-sm font-semibold text-indigo-600">Read more →</span>
        </div>
      </div>
    </div>
  );
}
