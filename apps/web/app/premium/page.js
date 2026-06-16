  import { redirect } from 'next/navigation';

  export default function PremiumRedirectPage() {
    redirect('/subscriptions');
  }
