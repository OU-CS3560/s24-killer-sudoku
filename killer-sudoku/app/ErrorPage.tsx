/**
 * @file     ErrorPage.tsx
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    A default route for when a page does not exist
 * @date     March 09, 2024
*/
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        </div>
    );
}