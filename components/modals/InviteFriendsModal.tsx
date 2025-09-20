import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, UsersRound, PlusCircle, CheckCircle } from 'lucide-react';
import { FriendData } from '../../types';
import { NEARBY_FRIENDS_DATA } from '../../constants';

interface InviteFriendsModalProps {
  onClose: () => void;
  currentInvited: Set<string>;
  onInviteToggle: (friendName: string) => void;
}

const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({ onClose, currentInvited, onInviteToggle }) => {
  return (
    <ModalWrapper open={true} onClose={onClose} customClasses="max-w-md w-full">
      <div className="bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-1.5 sm:gap-2">
            <UsersRound size={22} className="text-indigo-500" />Invita Amici
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-2.5 sm:space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-3">Seleziona gli amici da invitare al tuo evento. Vengono mostrati amici (simulati) nelle vicinanze.</p>
          {NEARBY_FRIENDS_DATA.map((friend: FriendData) => (
            <div
              key={friend.id}
              onClick={() => onInviteToggle(friend.name)}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                currentInvited.has(friend.name) ? 'bg-indigo-100 border-indigo-400 shadow-md ring-2 ring-indigo-300' : 'bg-white hover:bg-slate-50 border-slate-200'
              } border active:scale-[0.98]`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img src={friend.avatar} alt={friend.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" />
                <div>
                  <p className="font-medium text-sm sm:text-base text-slate-700">{friend.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">~ {friend.distance} da te</p>
                </div>
              </div>
              {currentInvited.has(friend.name) ? (
                <CheckCircle size={20} className="text-indigo-500" />
              ) : (
                <PlusCircle size={20} className="text-slate-400 hover:text-indigo-500" />
              )}
            </div>
          ))}
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            Conferma Inviti ({currentInvited.size})
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default InviteFriendsModal;