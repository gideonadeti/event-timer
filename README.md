# Event Timer

## Overview

[Event Timer](https://gideonadeti-event-timer.vercel.app/) is a web application for setting countdowns to future events and count-ups from past events.

## Features

- **Create, Update, and Delete Events**
- **Create, Update, and Delete Groups**
- **Toggle Themes**
- **Display Countdowns and Count-Ups in compacted and expanded time formats**
- **See live countdowns and count-ups**
- **Easily search and filter long lists of events**

## Technologies Used

- **Frontend & Backend**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components Library**: [Shadcn UI](https://ui.shadcn.com/)
- **Data Fetching & State Management**: [React Query](https://tanstack.com/query/v4)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication & User Management**: [Clerk](https://clerk.com/)
- **Version Control**: [Git](https://git-scm.com/) and [GitHub](https://github.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

- Clone the repository: `git clone https://github.com/gideonadeti/event-timer.git`
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Deploy to Vercel: [Deploy to Vercel](https://vercel.com/new/git/external?repository-url=https://github.com/your-username/event-timer.git)

## Contributing & Issues

Contributions are welcome! Please fork the repository and submit a pull request or open an issue.

## Challenges

- **Unable to implement easy selection of dates**: Currently you have to use month navigation to select a date. This makes it difficult to select dates for events far in the past or far in the future.
- **Unable to keep initial type and dates when updating events**: This is because of how the calender component works. I'm not sure how to fix this.
