import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

interface SponsoredItem {
  type: 'mk' | 'lobbyist';
  name: string;
  party?: string;
  org?: string;
  stance: 'for' | 'against';
  quote: string;
}

interface Props {
  items: SponsoredItem[];
}

export default function SponsoredContent({ items }: Props) {
  const forItems = items.filter(i => i.stance === 'for');
  const againstItems = items.filter(i => i.stance === 'against');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          תוכן ממומן
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* For */}
        <div>
          <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-1.5">
            <FiThumbsUp size={14} />
            בעד ההצעה
          </h4>
          <div className="space-y-3">
            {forItems.map((item, i) => (
              <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.type === 'mk' ? item.party : item.org}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Against */}
        <div>
          <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-1.5">
            <FiThumbsDown size={14} />
            נגד ההצעה
          </h4>
          <div className="space-y-3">
            {againstItems.map((item, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.type === 'mk' ? item.party : item.org}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
