import type { Group, Lesson, Topic } from '@/types';

export const mockGroups: Group[] = [
  { id: 1, name: 'n105', direction: 'Backend', teacher: '4', startDate: '2026 M05 1' },
];

export const mockLessons: Lesson[] = [
  { id: 1, title: 'NextJs', video: '0', hwStatus: 'Qaytarilgan', hwDeadline: '2026 M06 11 20:00', date: '2026 M06 11' },
  { id: 2, title: 'crm loyihasi', video: '2', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M06 09 20:00', date: '2026 M06 09' },
  { id: 3, title: 'Imtihon', video: '0', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M06 02 20:00', date: '2026 M06 02' },
  { id: 4, title: 'State and Props', video: '1', hwStatus: 'Berilmagan', hwDeadline: '-', date: '2026 M05 21' },
  { id: 5, title: 'takrorlash', video: '1', hwStatus: 'Bajarilmagan', hwDeadline: '2026 M05 19 20:00', date: '2026 M05 19' },
  { id: 6, title: 'Nodejs', video: '1', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M05 14 20:00', date: '2026 M05 14' },
  { id: 7, title: 'Html asoslari', video: '1', hwStatus: 'Qaytarilgan', hwDeadline: '2026 M05 12 20:00', date: '2026 M05 12' },
];

export const mockTopics: Topic[] = [
  {
    id: 1, title: 'NextJs', date: '2026 M06 11', videos: [],
    hwStatus: 'Qaytarilgan',
    homeworkDetails: {
      score: 0,
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 16 May, 2026 18:42',
        deadlineStatus: 'danger', fileCount: 0,
        description: "crm loyohasini, kurs , xona, teacher, student,group qisimlarini to'lliq qilib kelish, vercel yoki netlify linki joylansin",
        date: '18:42 14 May, 2026',
      },
      submission: {
        title: "Mening jo'natmalarim", fileCount: 0,
        links: ['https://6a08a17f6f27521adf2b6f3c--incredible-paprenjak-5441d6.netlify.app/', 'https://github.com/xdislom/7-oy-imtihon'],
        date: '21:56 16 May, 2026', status: 'Tahrirlangan',
      },
      feedback: {
        title: "O'qituvchi izohi", status: 'Vazifa bekor qilindi',
        warning: "Kechikib topshirilgani uchun qo'yilgan 0 ball 5 % ga kamaytirildi.",
        comment: "Dashboardga o'tib bo'mayapti authni tekshirib qayta yuklang",
        checker: 'Muxammedaliy +++Ametov', date: '14:02 19 May, 2026',
      },
    },
  },
  {
    id: 2, title: 'crm loyihasi', date: '2026 M06 09',
    videos: [
      { id: 1, title: 'crm loyihasi qismi 1', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'crm loyihasi qismi 2', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
    hwStatus: 'Qabul qilingan',
    homeworkDetails: {
      score: 90,
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 14 May, 2026 15:54',
        deadlineStatus: 'danger', fileCount: 0,
        description: 'crm loyihasi dashboard va login sahifasi\n\nvercel yoki netlify',
        date: '15:54 12 May, 2026',
      },
      submission: {
        title: "Mening jo'natmalarim", fileCount: 0,
        links: ['https://github.com/xdislom/7-oy-imtihon/tree/main', 'https://69ff6564c5d71ba3ee0a7861--courageous-malabi-b7c4ce.netlify.app/'],
        date: '16:08 12 May, 2026',
      },
      feedback: {
        title: "O'qituvchi izohi", status: 'Vazifa qabul qilindi',
        comment: 'Vazifa yaxshi bajarilgan )', checker: 'Muxammedaliy +++Ametov', date: '11:16 15 May, 2026',
      },
      footerMessage: 'Qayta topshirish imkoniyati berilmagan',
    },
  },
  {
    id: 3, title: 'Imtihon', date: '2026 M06 02', videos: [],
    hwStatus: 'Qabul qilingan',
    homeworkDetails: {
      score: 90,
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 14 May, 2026 15:54',
        fileCount: 0, description: 'crm loyihasi dashboard va login sahifasi\n\nvercel yoki netlify', date: '15:54 12 May, 2026',
      },
      submission: {
        title: "Mening jo'natmalarim", fileCount: 0,
        links: ['https://github.com/xdislom/7-oy-imtihon/tree/main', 'https://69ff6564c5d71ba3ee0a7861--courageous-malabi-b7c4ce.netlify.app/'],
        date: '16:08 12 May, 2026',
      },
      feedback: {
        title: "O'qituvchi izohi", status: 'Vazifa qabul qilindi',
        comment: 'Vazifa yaxshi bajarilgan )', checker: 'Muxammedaliy +++Ametov', date: '11:16 15 May, 2026',
      },
      footerMessage: 'Qayta topshirish imkoniyati berilmagan',
    },
  },
  {
    id: 4, title: 'State and Props', date: '2026 M05 21',
    videos: [{ id: 3, title: 'State and Props', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
    hwStatus: 'Berilmagan',
  },
  {
    id: 5, title: 'takrorlash', date: '2026 M05 19',
    videos: [{ id: 4, title: 'takrorlash darsi', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
    hwStatus: 'Bajarilmagan',
    homeworkDetails: {
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 14 Iyun, 2026 17:31',
        deadlineStatus: 'warning', fileCount: 1,
        description: "Product Management\nReact/Next Js\nTailwind Css\nState Management - Redux, Zustand\nCss Componenets - Ant, Material Ui\nApi integration - Superbase, MockApi\nDashboard - Ko'rish, Xarid qilish\nAdmin - CRUD",
        date: '17:31 12 Iyun, 2026',
        attachment: { name: 'homework.txt' },
      },
    },
  },
  {
    id: 6, title: 'Nodejs', date: '2026 M05 14',
    videos: [{ id: 5, title: 'Nodejs Kirish', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
    hwStatus: 'Qabul qilingan',
    homeworkDetails: {
      score: 90,
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 14 May, 2026 15:54',
        fileCount: 0, description: 'crm loyihasi dashboard va login sahifasi\n\nvercel yoki netlify', date: '15:54 12 May, 2026',
      },
      submission: {
        title: "Mening jo'natmalarim", fileCount: 0,
        links: ['https://github.com/xdislom/7-oy-imtihon/tree/main', 'https://69ff6564c5d71ba3ee0a7861--courageous-malabi-b7c4ce.netlify.app/'],
        date: '16:08 12 May, 2026',
      },
      feedback: {
        title: "O'qituvchi izohi", status: 'Vazifa qabul qilindi',
        comment: 'Vazifa yaxshi bajarilgan )', checker: 'Muxammedaliy +++Ametov', date: '11:16 15 May, 2026',
      },
      footerMessage: 'Qayta topshirish imkoniyati berilmagan',
    },
  },
  {
    id: 7, title: 'Html asoslari', date: '2026 M05 12',
    videos: [{ id: 6, title: 'HTML dars', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
    hwStatus: 'Qaytarilgan',
    homeworkDetails: {
      score: 0,
      task: {
        title: 'Uyga vazifa', deadline: 'Uyga vazifa muddati: 16 May, 2026 18:42',
        deadlineStatus: 'danger', fileCount: 0,
        description: "crm loyohasini, kurs , xona, teacher, student,group qisimlarini to'lliq qilib kelish, vercel yoki netlify linki joylansin",
        date: '18:42 14 May, 2026',
      },
      submission: {
        title: "Mening jo'natmalarim", fileCount: 0,
        links: ['https://6a08a17f6f27521adf2b6f3c--incredible-paprenjak-5441d6.netlify.app/', 'https://github.com/xdislom/7-oy-imtihon'],
        date: '21:56 16 May, 2026', status: 'Tahrirlangan',
      },
      feedback: {
        title: "O'qituvchi izohi", status: 'Vazifa bekor qilindi',
        warning: "Kechikib topshirilgani uchun qo'yilgan 0 ball 5 % ga kamaytirildi.",
        comment: "Dashboardga o'tib bo'mayapti authni tekshirib qayta yuklang",
        checker: 'Muxammedaliy +++Ametov', date: '14:02 19 May, 2026',
      },
    },
  },
];

export function getStatusStyle(status: string): string {
  switch (status) {
    case 'Qaytarilgan': return 'bg-[#fbb630]';
    case 'Qabul qilingan': return 'bg-[#50bc5f]';
    case 'Berilmagan': return 'bg-[#7b809a]';
    case 'Bajarilmagan': return 'bg-[#f04445]';
    default: return 'bg-gray-500';
  }
}
