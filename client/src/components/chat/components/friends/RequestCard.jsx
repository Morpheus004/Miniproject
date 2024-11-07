// RequestCard.jsx
import React from 'react';
import { Button } from '../../../ui/buttons';
import { Check, X } from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject }) => (
  <div className="bg-white rounded-lg p-4 mb-2 shadow-sm">
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
        style={{ backgroundColor: `hsl(${request.sender_name.charCodeAt(0) * 137.508} 70% 60%)` }}
      >
        {request.sender_name[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{request.sender_name}</h3>
        <p className="text-sm text-gray-500">{request.sender_email}</p>
        <p className="text-xs text-gray-400">
          {new Date(request.request_date).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      <Button 
        size="sm"
        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
        onClick={() => onAccept(request.sender_id)}
      >
        <Check className="w-4 h-4 mr-1" /> Accept
      </Button>
      <Button 
        size="sm"
        className="flex-1 text-red-500 hover:bg-red-50"
        variant="ghost"
        onClick={() => onReject(request.sender_id)}
      >
        <X className="w-4 h-4 mr-1" /> Decline
      </Button>
    </div>
  </div>
);

export default RequestCard;