<?php

namespace App\Mail;

use App\Models\AgentNouveau;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AgentWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $agent;
    public $plainPassword;

    public function __construct(AgentNouveau $agent, string $plainPassword)
    {
        $this->agent = $agent;
        $this->plainPassword = $plainPassword;
    }

    public function build()
    {
        return $this->subject('Vos accès MTEFOP Digital')
                    ->view('emails.agent_welcome');
    }
}
