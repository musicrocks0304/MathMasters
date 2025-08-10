import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-gray-400 mb-4">404</CardTitle>
          <h1 className="text-2xl font-semibold text-gray-800">Page Not Found</h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist. Let's get you back to practicing math!
          </p>
          <Link href="/">
            <Button>Back to Math Practice</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;