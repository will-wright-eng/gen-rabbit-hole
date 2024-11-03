import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, RotateCcw, Sun, Moon, Laptop, Trash2 } from "lucide-react";
import { useTheme } from '../../hooks/useTheme';

const SettingsMenu = ({ onResetOnboarding, onResetFlow }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 mr-2" />
            ) : (
              <Sun className="h-4 w-4 mr-2" />
            )}
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onResetFlow}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Flow
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onResetOnboarding}>
          <Trash2 className="h-4 w-4 mr-2" />
          Reset Onboarding
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
