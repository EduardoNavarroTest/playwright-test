import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import logo from '../assets/ai.webp';
import { getUserLogged } from '../services/whoamiService.js';
import Tooltip from '@mui/material/Tooltip';

// Styled Components con más estilo
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,  // bordes más redondeados
    backgroundColor: alpha(theme.palette.common.white, 0.20),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.35),
        boxShadow: '0 0 8px rgba(255,255,255,0.3)',
    },
    marginRight: theme.spacing(3),
    marginLeft: 0,
    width: '100%',
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    fontWeight: 500,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(5)})`,
        transition: theme.transitions.create(['width', 'background-color'], {
            duration: theme.transitions.duration.shorter,
        }),
        width: '100%',
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:focus': {
            backgroundColor: alpha(theme.palette.common.white, 0.30),
            width: '28ch',
        },
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const NavLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 600,
    padding: theme.spacing(0.5, 1.5),
    borderRadius: theme.shape.borderRadius,
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
}));

export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        getUserLogged()
            .then(data => setUser(data.user))
            .catch(err => console.error("Error obteniendo usuario:", err));
    }, []);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                elevation: 8,
                sx: {
                    mt: '45px',
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                },
            }}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
            PaperProps={{
                elevation: 8,
                sx: {
                    mt: '45px',
                    minWidth: 220,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                },
            }}
        >
            <MenuItem>
                <NavLink to="/chatbot" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <Typography variant="body1" sx={{ ml: 1 }}>Messages</Typography>
                </NavLink>
            </MenuItem>

            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={0} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Typography variant="body1">Notifications</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Typography variant="body1">Profile</Typography>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#1976d2',  // azul sólido, puedes cambiarlo al que prefieras
                    boxShadow: '0 3px 8px rgba(25, 118, 210, 0.5)',
                    borderBottom: '2px solid rgba(255,255,255,0.15)',
                }}
            >

                <Toolbar>
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{
                                mr: 2,
                                p: 0,
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                                borderRadius: 2,
                            }}
                        >
                            <img
                                src={logo}
                                alt="logo"
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '8px',
                                    boxShadow: '0 0 8px rgba(255,255,255,0.3)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                        </IconButton>
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 4 }}>
                            <NavLink to="/test-cases">Documentación</NavLink>
                            <NavLink to="/testers">Test Run</NavLink>
                            <NavLink to="/upload-pdf">Conocimiento</NavLink>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Link to="/chatbot" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <IconButton size="large" aria-label="show new mails" color="inherit" sx={{
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                                borderRadius: 2,
                            }}>
                                <Badge badgeContent={0} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                        </Link>
                        <IconButton
                            size="large"
                            aria-label="show new notifications"
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                                borderRadius: 2,
                            }}
                        >
                            <Badge badgeContent={0} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Tooltip title={user || ''}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha('#fff', 0.1),
                                    },
                                    borderRadius: 2,
                                }}
                            >
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                                borderRadius: 2,
                            }}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
